import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://www.globeair.com/emptylegs/calendar', {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch GlobeAir data' }, { status: 500 });
    }

    const icalText = await response.text();
    const flights = parseICal(icalText);

    return NextResponse.json(flights);
  } catch (error) {
    console.error('Error in GlobeAir API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function parseICal(text: string) {
  const events = text.split('BEGIN:VEVENT');
  const flights: any[] = [];

  // Skip the first part before the first VEVENT
  for (let i = 1; i < events.length; i++) {
    const event = events[i];
    
    const summaryMatch = event.match(/SUMMARY:(.+)/);
    const descriptionMatch = event.match(/DESCRIPTION:(.+)/s); // /s to match newlines
    const dtstartMatch = event.match(/DTSTART:(.+)/);
    const dtendMatch = event.match(/DTEND:(.+)/);
    
    if (!summaryMatch || !dtstartMatch) continue;

    const summary = summaryMatch[1].trim();
    const description = descriptionMatch ? descriptionMatch[1].trim() : '';
    const dtstart = dtstartMatch[1].trim();

    // Ignore unconfirmed flights (they usually have [XX%] in summary or different description)
    if (summary.includes('%') || description.includes('not confirmed yet')) {
      continue;
    }

    // Parse Summary: "Nuremberg (NUE) > Munich (OBF)"
    const routeMatch = summary.match(/(.+) \(([^)]+)\) > (.+) \(([^)]+)\)/);
    let depAirport = '';
    let destAirport = '';
    
    if (routeMatch) {
      depAirport = `${routeMatch[1]} (${routeMatch[2]})`;
      destAirport = `${routeMatch[3]} (${routeMatch[4]})`;
    } else {
      // Fallback if format is different
      const parts = summary.split('>');
      if (parts.length === 2) {
        depAirport = parts[0].trim();
        destAirport = parts[1].trim();
      }
    }

    // Parse Date/Time: "20260511T162000Z" or "20260511T162000"
    const year = dtstart.substring(0, 4);
    const month = dtstart.substring(4, 6);
    const day = dtstart.substring(6, 8);
    const hour = dtstart.substring(9, 11);
    const minute = dtstart.substring(11, 13);
    
    const departureDate = `${year}-${month}-${day}`;
    let departureTime = `${hour}:${minute}`;
    
    if (dtendMatch) {
      const dtend = dtendMatch[1].trim();
      const endHour = dtend.substring(9, 11);
      const endMinute = dtend.substring(11, 13);
      departureTime = `${hour}:${minute} - ${endHour}:${endMinute}`;
    }

    const priceMatch = description.match(/Current price: €([\d,]+)/);
    let netPrice = 0;
    if (priceMatch) {
      netPrice = parseInt(priceMatch[1].replace(',', ''));
      netPrice = Math.round(netPrice * 1.1); // Add 10% markup
    }

    flights.push({
      id: `globeair-${i}`, // Synthetic ID
      departure_airport: depAirport,
      destination_airport: destAirport,
      departure_date: departureDate,
      departure_time: departureTime,
      aircraft_model: 'Cessna Citation Mustang', // GlobeAir uses Mustangs
      seats: 4, // Mustang has 4 seats
      net_price: netPrice,
      broker_fee: 0, // We can add our fee here or handle it in the UI
      pet_friendly: true, // GlobeAir is pet friendly
      wifi_available: false,
      smoking_permitted: false,
      status: 'available',
      source: 'globeair' // To identify the source
    });
  }

  return flights;
}
