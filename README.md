# Webphone Client
built with laravel `8.26.1`  

## Requirements
- `php >= 7.3`

## Usage
- put the `public` content folder in `public_html` and other file and folders in a folder before that.
- create a database and import `.sql` in the root folder.
- config the database and webphone customer settings in `.env` file.
- done.
> for more help you can watch the `installtionOnCpanel.mp4 `video that is in root folder and remove it after that.

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