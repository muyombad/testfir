import React, { useState } from 'react';
import { Search, Plane, Calendar, User, Loader2 } from 'lucide-react';

const FlightSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [flights, setFlights] = useState([]);
  const [searchParams, setSearchParams] = useState({
    originSkyId: 'STN',
    destinationSkyId: 'SWF',
    originEntityId: '95565052',
    destinationEntityId: '95566280',
    date: '2024-11-29',
    passengers: 1
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const url = `https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights?originSkyId=${searchParams.originSkyId}&destinationSkyId=${searchParams.destinationSkyId}&originEntityId=${searchParams.originEntityId}&destinationEntityId=${searchParams.destinationEntityId}&date=${searchParams.date}&cabinClass=economy&adults=${searchParams.passengers}&sortBy=best&currency=USD&market=en-US&countryCode=US`;
      
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '685cf8faa9mshcd4e46731f433a5p18784djsn8c83e30ecc2b', // Use environment variable
          'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
        }
      };
  
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      
      // Transform flights from the specific API response structure
      const transformedFlights = data.data.itineraries.map((itinerary, index) => {
        const leg = itinerary.legs[0];
        const firstSegment = leg.segments[0];
        const lastSegment = leg.segments[leg.segments.length - 1];

        return {
          id: index + 1,
          airline: leg.carriers.marketing[0].name,
          flightNumber: `${firstSegment.marketingCarrier.alternateId}${firstSegment.flightNumber}`,
          departure: new Date(leg.departure).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }),
          arrival: new Date(leg.arrival).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }),
          duration: `${Math.floor(leg.durationInMinutes / 60)}h ${leg.durationInMinutes % 60}m`,
          price: itinerary.price.raw,
          stops: leg.stopCount,
          segments: leg.segments
        };
      });
  
      if (transformedFlights.length === 0) {
        setError('No flights found matching your search criteria');
        return;
      }
  
      setFlights(transformedFlights);
    } catch (err) {
      console.error('Flight Search Error:', err);
      setError(`Failed to fetch flights: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Plane className="text-blue-500" />
            Flight Search
          </h1>
        </header>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4 md:space-y-0 md:flex md:gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <div className="relative">
                <input
                  type="text"
                  name="originSkyId"
                  value={searchParams.originSkyId}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md pl-8"
                  placeholder="Airport Code"
                  required
                />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <div className="relative">
                <input
                  type="text"
                  name="destinationSkyId"
                  value={searchParams.destinationSkyId}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md pl-8"
                  placeholder="Airport Code"
                  required
                />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  value={searchParams.date}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md pl-8"
                  required
                />
                <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
              <div className="relative">
                <input
                  type="number"
                  name="passengers"
                  value={searchParams.passengers}
                  onChange={handleInputChange}
                  min="1"
                  max="9"
                  className="w-full p-2 border rounded-md pl-8"
                  required
                />
                <User className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Search Flights
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {flights.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Available Flights</h2>
            {flights.map(flight => (
              <div key={flight.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-medium text-lg">{flight.airline}</div>
                    <div className="text-sm text-gray-500">Flight {flight.flightNumber}</div>
                  </div>
                  
                  <div className="flex-1 flex items-center gap-4">
                    <div className="text-center">
                      <div className="font-medium">{flight.departure}</div>
                      <div className="text-sm text-gray-500">{searchParams.originSkyId}</div>
                    </div>
                    <div className="flex-1 border-t border-gray-300 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
                        {flight.duration}
                        {flight.stops > 0 && ` • ${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{flight.arrival}</div>
                      <div className="text-sm text-gray-500">{searchParams.destinationSkyId}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-medium text-lg">${flight.price}</div>
                    <div className="text-sm text-gray-500">
                      {flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightSearch;