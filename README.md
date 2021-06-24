# Webphone Client
built with laravel `8.26.1`  

## Requirements
- `php >= 7.3`

## Usage
- clone repository
- cp .env.example .env
- config database in `.env` 
- `php artisan migrate --seed`
- `php artisan serve`

# Just For Developers
> `vendor` forlder removed from `.gitignore` for easy installation on shared hostings.
for dummy data run the following : 
```
php artisan iseed users,webphones --force
```
## Install
- `clone https://github.com/voipiran/webphone-client.git`
- `cp .env.example .env`
- config database in `.env`
- `composer install`
- `php artisan migrate --seed`
- `php artisan serve`