# frozen_string_literal: true

module Views
  # View object for attraction
  class Attraction
    # Error for invalid search term
    class InvalidSearchTerm < StandardError
      def message
        'Invalid search term'
      end
    end

    def initialize(attraction)
      @attraction = attraction
    end

    def place_id
      @attraction.place_id
    end

    def name
      @attraction.name
    end

    def description
      @attraction.description
    end

    def address
      @attraction.address
    end

    def rating
      @attraction.rating
    end

    def type
      @attraction.type
    end

    def opening_hours
      @attraction.opening_hours
    end

    def latitude
      @attraction.location['latitude']
    end

    def longitude
      @attraction.location['longitude']
    end

    def reccomendation_url
      @attraction.links.find { |link| link['rel'] == 'self' }['href']
    end

    def to_json(options = {}) # rubocop:disable Metrics/MethodLength
      {
        place_id:,
        name:,
        description:,
        address:,
        rating:,
        type:,
        opening_hours:,
        latitude:,
        longitude:,
        reccomendation_url:
      }.to_json(options)
    end

    def to_map_pin
      {
        position: { lat: latitude, lng: longitude },
        title: name
      }
    end
  end
end
