# frozen_string_literal: true

# attribute :place_id,  Strict::String
# attribute :name,      Strict::String
# attribute :address,   Strict::String
# attribute :rating,    Coercible::Float

module TravelRoute
  module Repository
    # Repository for Place Entities
    class Places
      def self.all
        Database::PlaceOrm.all.map { |db_place| rebuild_entity(db_place) }
      end

      def self.find(entity)
        find_id(entity.place_id)
      end

      def self.find_id(place_id)
        db_record = Database::PlaceOrm.first(place_id:)
        rebuild_entity(db_record)
      end

      def self.find_name(place_name)
        db_records = Database::PlaceOrm.where(Sequel.ilike(:name, "%#{place_name}%"))
        rebuild_many(db_records)
      end

      def self.create(entity)
        raise 'Place already exists' if find(entity)

        db_place = Database::PlaceOrm.create(entity.to_attr_hash)
        rebuild_entity(db_place)
      end

      def self.rebuild_entity(db_record)
        return nil unless db_record

        Entity::Place.new(
          db_record.to_hash
        )
      end

      def self.rebuild_many(db_records)
        db_records.map do |db_record|
          rebuild_entity(db_record)
        end
      end
    end
  end
end
