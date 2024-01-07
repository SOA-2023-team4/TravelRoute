# frozen_string_literal: true

require_relative 'route_attraction'

module Views
  # View object for plan
  class Plan
    attr_reader :plan

    def initialize(plan)
      @plan = plan.value!
    end

    def day_plans
      @plan.day_plans
    end

    def days
      day_plans.count
    end

    def dates
      day_plans.map(&:date)
    end

    def visit_durations
      day_plans.map(&:visit_durations)
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
      visit_durations.map do |day|
        day.map(&:attraction).map { Views::Attraction.new(_1).to_map_pin }
      end
    end
  end
end
