# frozen_string_literal: true

module Views
  # View object for list of attractions
  class AttractionList
    def initialize(attractions)
      @attractions = attractions
    end

    def attractions
      @attractions.map do |attraction|
        Views::Attraction.new(attraction)
      end
    end

    def to_json(options = {})
      {
        attractions:
      }.to_json(options)
    end

    def to_map_pins
      @attractions.map(&:to_map_pin)
    end
  end
end
