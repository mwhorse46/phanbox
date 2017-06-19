# Phanbox - basic vagrant machine for Node.js and PHP applications

### Installation

* Install [Virtual Box](https://www.virtualbox.org/wiki/Downloads) (>= 5.0 version)
* Install [Vagrant](https://www.vagrantup.com/downloads.html) (>=1.8.5 version)
* Install [Vagrant Host Manager plugin](https://github.com/devopsgroup-io/vagrant-hostmanager) (`vagrant plugin install vagrant-hostmanager`)
* Install [Vagrant Virtual Box guest additions plugin](https://github.com/dotless-de/vagrant-vbguest) (`vagrant plugin install vagrant-vbguest`)
* If your application has too many composer dependencies and github asks for authorization then you need to copy `./ansible/vars/locals.yml.dist` to `./ansible/vars/locals.yml` and put there your GitHub token.
* Run `vagrant up`

#### Test virtual hosts:

* [http://[www].phanbox.local/](http://phanbox.local/) - PHP application home page (index.php). It also contains healthcheck logic to verify that PHP app is successfully connected to MySQL and Redis.
* [http://phanbox.local/phpinfo.php](http://phanbox.local/phpinfo.php) - PHP info page
* [http://phanbox.local/index.html](http://phanbox.local/index.html) - Static HTML page served by NGINX
* [http://phanbox.local:3000](http://phanbox.local:3000) - Node.js application home page. It also contains healthcheck logic to verify that Node.js app is successfully connected to MySQL and Redis.

### What does the box consist of?

The box is provisioned using [Ansible](https://www.ansible.com/) tool.
The local host directory `./machine` is mounted to `/vagrant` directory inside vagrant machine
The ansible playbook, roles, tasks and other resources are residing in `machine/ansible` directory, while the application specific code - inside `machine/application`.
The provisioned vagrant machine has following items:

* Ubuntu Xenial64 (16.04 LTS)
* PHP application
    - PHP-FPM 7.1
    - nginx
    - xdebug
    - composer
    - Application root: `machine/application/app-php`
    - Document root: `machine/application/app-php/public`
* Node.js application
    - Node.js 8.x
    - Application root: `machine/application/app-node`
    - The application is run using `npm start` command
    - Port: 3000
    - Environemnt: 'development'
    - Systemd service called `app-node` i.e. when you are inside vagrant machine you may start/stop/restart it with `sudo service app-node start/stop/restart` command
* MySQL Percona 5.7
* Redis 3.x

It may be easily extended and modified with a little knowledge of Ansible.

#### Vagrant machine default settings (could be changed in Vagrantfile)

- Hostname: **phanbox.local**
- Allocated CPUs: **4** (cores)
- Allocated Memory: **4096** (MB)
- IP address: **10.10.10.10**

#### PHP Application

If you do not need PHP application:

- Go to `machine/ansible/playbook.yml` and delete **app-php** role from the list
- Go to `machine/ansible/vars/globals.yml` and delete **app_php** section

If you want to customize it then you may take a look at **app_php** section to modify application/document roots, server name.
It is pretty basic application and you may want to add provisioning logic to it. It is failrly easy to do if you have a little knowledge of Ansible.
All you need is to go to the `machine/ansible/roles/app-php` and add there whatever tasks and logic you need.

- See machine/ansible/vars/globals.yml

#### Node.js Application

If you do not need Node.js application then:

- Go to `machine/ansible/playbook.yml` and delete **app-node** role from the list
- Go to `machine/ansible/vars/globals.yml` and delete **app_node** section

To run Node.js application automatically there is systemd service created which is started automatically when vagrant machine is launched.
If you want to interact with the service the you shoud do:

- `vagrant ssh`
- `sudo service app-node restart` - will restart the node.js app
- `sudo service app-nodestop` - will stop the node.js app (for example, you want to run it manually instead)
- `sudo service app-node start` - will start the sevice again
- service logs may be found at `/var/log/app-node.log`

If you want to customize it then you may take a look at **app_node** section to modify application root, port, systemd service name, environment.
It is pretty basic application and you may want to add provisioning logic to it. It is failrly easy to do if you have a little knowledge of Ansible.
All you need is to go to the `machine/ansible/roles/app-node` and add there whatever tasks and logic you need.

#### MySQL

The default parameters for mysql server:

- Username: *app*
- Password: *app*
- Database: *app*
- Database dump (will be imported only once during the first provisioning): `machine/dump.sql`

If you want to customize these parameters see `machine/ansible/vars/globals.yml` **mysql** section
