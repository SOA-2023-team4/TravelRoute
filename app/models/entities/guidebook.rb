# frozen_string_literal: true

require_relative 'attraction'

module TravelRoute
  module Entity
    # aggregate to lookup for place info and routes info
    class Guidebook
      attr_reader :attractions, :matrix

      def initialize(attractions, matrix)
        @attractions = attractions
        @matrix = matrix
      end

      def to_matrix
        @matrix.map do |row|
          row.map(&distance)
        end
      end

      def attraction_count
        attractions.count
      end
    end
  end
end