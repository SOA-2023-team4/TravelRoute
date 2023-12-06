# frozen_string_literal: true

require 'figaro'
require 'logger'
require 'rack/session'
require 'roda'

module TravelRoute
  # Configuration for the App
  class App < Roda
    plugin :environments

    # Environment variables setup
    Figaro.application = Figaro::Application.new(
      environment:,
      path: File.expand_path('config/secrets.yml')
    )
    Figaro.load
    def self.config = Figaro.env

    use Rack::Session::Cookie, secret: config.SESSION_SECRET

    configure :development, :test, :app_test do
      require 'pry'; # for breakpoints
    end

    # Logger
    @logger = Logger.new($stderr)
    def self.logger = @logger # rubocop:disable Style/TrivialAccessors
  end
end
