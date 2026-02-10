import { Injectable } from '@nestjs/common';
import { DataService } from '../common/data.service';

@Injectable()
export class EventsService {
  constructor(private readonly data: DataService) {}

  addEvent(input: {
    name: string;
    eventDate: string;
    venue: string;
    lat: number;
    lng: number;
    impactLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    source: string;
  }) {
    const event = { id: this.data.events.length + 1, ...input };
    this.data.events.push(event);
    this.applyStopSell(event.id, 10);
    return event;
  }

  applyStopSell(eventId: number, radiusKm: number) {
    const event = this.data.events.find((e) => e.id === eventId);
    if (!event || event.impactLevel !== 'HIGH') {
      return { affected: 0 };
    }

    const affectedProperties = this.data.properties.filter((p) => this.distanceKm(p.lat, p.lng, event.lat, event.lng) <= radiusKm);
    let affected = 0;
    for (const rate of this.data.rates) {
      if (rate.date === event.eventDate && affectedProperties.some((p) => p.id === rate.propertyId) && rate.status !== 'STOP_SELL') {
        rate.status = 'STOP_SELL';
        rate.source = 'EVENT_STOP_SELL';
        affected += 1;
      }
    }
    return { affected };
  }

  list() {
    return this.data.events;
  }

  private distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const r = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return r * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
}
