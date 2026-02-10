import argparse
import datetime as dt
import json
import random
import time
from dataclasses import dataclass, asdict

from apscheduler.schedulers.blocking import BlockingScheduler


@dataclass
class EventRecord:
    name: str
    event_date: str
    venue: str
    lat: float
    lng: float
    impact_level: str
    source: str
    source_url: str
    raw_data: dict
    crawled_at: str


VENUE_COORDS = {
    "台北小巨蛋": (25.0512, 121.5495),
    "高雄巨蛋": (22.6664, 120.3020),
}


def fake_fetch_from_source(source: str) -> list[dict]:
    return [
        {
            "name": "五月天 2025 巡迴演唱會",
            "event_date": "2025-03-15",
            "venue": "台北小巨蛋",
            "ticket_status": "ON_SALE",
        }
    ]


def normalize(raw: dict, source: str) -> EventRecord:
    lat, lng = VENUE_COORDS.get(raw["venue"], (25.0, 121.0))
    impact_level = "HIGH" if "五月天" in raw["name"] else "MEDIUM"
    return EventRecord(
        name=raw["name"],
        event_date=raw["event_date"],
        venue=raw["venue"],
        lat=lat,
        lng=lng,
        impact_level=impact_level,
        source=source,
        source_url="https://example.com/event/123",
        raw_data=raw,
        crawled_at=dt.datetime.utcnow().isoformat() + "Z",
    )


def write_to_jsonl(records: list[EventRecord], output: str = "events_dump.jsonl"):
    with open(output, "a", encoding="utf-8") as f:
        for row in records:
            f.write(json.dumps(asdict(row), ensure_ascii=False) + "\n")


def run_once():
    sources = ["KKTIX", "拓元售票", "ibon", "台北小巨蛋", "高雄巨蛋"]
    normalized: list[EventRecord] = []

    for source in sources:
        for attempt in range(1, 4):
            try:
                raw_rows = fake_fetch_from_source(source)
                normalized.extend([normalize(r, source) for r in raw_rows])
                break
            except Exception as exc:  # noqa: BLE001
                if attempt == 3:
                    print(f"[ALERT] source={source} failed: {exc}")
                else:
                    sleep_s = 2 ** attempt + random.random()
                    time.sleep(sleep_s)

    write_to_jsonl(normalized)
    print(f"crawler finished, records={len(normalized)}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--once", action="store_true")
    args = parser.parse_args()

    if args.once:
        run_once()
        return

    scheduler = BlockingScheduler(timezone="Asia/Taipei")
    scheduler.add_job(run_once, "cron", hour=2, minute=0, id="daily_full")
    scheduler.add_job(run_once, "interval", hours=4, id="incremental")
    scheduler.add_job(run_once, "interval", minutes=30, id="hot_events")
    scheduler.start()


if __name__ == "__main__":
    main()
