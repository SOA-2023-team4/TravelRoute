# frozen_string_literal: true

# attribute :origin,          Place
# attribute :destination,     Place
# attribute :distance_meters, Strict::Integer
# attribute :duration,        Strict::Integer

module TravelRoute
  module Repository
    # Repository for Route Entities
    class Routes
      def self.all
        Database::RouteOrm.all.map { |db_route| rebuild_entity(db_route) }
      end

      # place_ids = ["ChIJB7ZNzXI2aDQREwR22ltdKxE", "ChIJl78Wnt01aDQRz1shOsBVUGU"]
      def self.find_route(origin_id, destination_id)
        db_record = Database::RouteOrm.first(origin_id:, destination_id:)
        rebuild_entity(db_record)
      end

      def self.find_routes(place_ids)
        place_pks = place_ids.map do |place_id|
          Database::PlaceOrm.find(place_id:)[:id]
        end
        db_records = Database::RouteOrm.where { origin_id =~ place_pks }
        rebuild_many(db_records)
      end

      def self.rebuild_entity(db_record)
        return nil unless db_record

        Entity::Route.new(
          db_record.to_hash.merge(
            origin: Places.rebuild_entity(db_record.origin),
            destination: Places.rebuild_entity(db_record.destination)
          )
        )
      end

      def self.rebuild_many(db_records)
        db_records.map{ |db_record|
          rebuild_entity(db_record)
        }
      end
    end
  end
end
