# frozen_string_literal: true

module TravelRoute
  # Data Mapper: Google Maps Place -> Place entity
  class PlaceMapper
    def initialize(api_key, gateway_class = GoogleMaps::Places::Api)
      @key = api_key
      @gateway_class = gateway_class
      @gateway = @gateway_class.new(@key)
    end

    def find(place_name)
      data = @gateway.places_from_text_data(place_name)
      build_entity(data)
    end

    def build_entity(data)
      candidates = data['candidates']
      place_ids = candidates.map { |entry| entry['place_id'] }
      results = place_ids.map { |place_id| @gateway.place_detail_data(place_id)['result'] }
      results.map { |entry| DataMapper.new(entry).build_entity }
    end

    # extract entity specific data
    class DataMapper
      def initialize(data)
        @data = data
      end

      def build_entity
        Entity::Place.new(
          id:,
          name:,
          address:,
          rating:
        )
      end

      private

      def id
        @data['place_id']
      end

      def address
        @data['formatted_address']
      end

      def name
        @data['name']
      end

      def rating
        @data['rating']
      end
    end
  end
end