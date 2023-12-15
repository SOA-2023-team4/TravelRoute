# frozen_string_literal: true

require_relative 'route_attraction'

module Views
  # View object for plan
  class Plan
    attr_reader :name

    def initialize(plan, name = 'Untitled')
      @plan = plan
      @name = name
    end

    def plan
      @plan.value!
    end

    def all_attractions
      plan.attractions
    end

    def origin
      plan.attractions.first
    end

    def last
      plan.attractions.last
    end

    def route_to_attractions
      plan.routes.zip(plan.attractions[1..]).map do |route, attraction|
        RouteAttraction.new(route, attraction)
      end
    end

    def to_pin
      AttractionList.new(all_attractions).to_map_pins
    end
  end
end
