#!/bin/bash
set -e

echo "🚀 Starting iKAPSI UHO Application..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
max_tries=30
count=0

until MYSQL_PWD="${DB_PASSWORD}" mysql --skip-ssl -h"${DB_HOST}" -u"${DB_USERNAME}" -e "SELECT 1" "${DB_DATABASE}" 2>/dev/null || [ $count -eq $max_tries ]; do
    count=$((count + 1))
    echo "Attempt $count/$max_tries: Database not ready yet..."
    sleep 2
done

if [ $count -eq $max_tries ]; then
    echo "❌ Error: Could not connect to database after $max_tries attempts"
    exit 1
fi

echo "✅ Database connection established"

# Run migrations with error handling
echo "📦 Running database migrations..."
if php artisan migrate --force; then
    echo "✅ Migrations completed successfully"
else
    echo "⚠️  Migration failed, but continuing..."
fi

# Generate application key if not set
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "base64:" ]; then
    echo "🔑 Generating application key..."
    php artisan key:generate --force
    echo "✅ Application key generated"
fi

# Clear and optimize
echo "🧹 Optimizing application..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Cache configuration for production
if [ "$APP_ENV" = "production" ]; then
    echo "⚡ Caching configuration for production..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    echo "✅ Cache optimized"
fi

# Set proper permissions
echo "🔒 Setting permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Create log files for supervisor processes
touch /var/www/html/storage/logs/queue-worker.log
touch /var/www/html/storage/logs/scheduler.log
chown www-data:www-data /var/www/html/storage/logs/queue-worker.log
chown www-data:www-data /var/www/html/storage/logs/scheduler.log

# Run seeders if specified
if [ "$RUN_SEEDERS" = "true" ]; then
    echo "🌱 Running database seeders..."
    php artisan db:seed --force
    echo "✅ Seeders completed"
fi

echo "✅ Application is ready!"
echo "🌐 Starting web server..."

# Execute the main container command
exec "$@"
