# Phanbox - the basic vagrant machine for Node.js and PHP applications

### Installation

* Install [Virtual Box](https://www.virtualbox.org/wiki/Downloads) (>= 5.0 version)
* Install [Vagrant](https://www.vagrantup.com/downloads.html) (>=1.8.5 version)
* Install [Vagrant Host Manager plugin](https://github.com/devopsgroup-io/vagrant-hostmanager) (`vagrant plugin install vagrant-hostmanager`)
* Install [Vagrant Virtual Box guest additions plugin](https://github.com/dotless-de/vagrant-vbguest) (`vagrant plugin install vagrant-vbguest`)
* If your application has too many composer dependencies and github asks for authorization then you need to copy `./ansible/vars/locals.yml.dist` to `./ansible/vars/locals.yml` and put there your GitHub token.
* Run `vagrant up`
* Wait until provisioning is finished...
* If you have Linux or Mac OS X then you'd better perform `vagrant reload` after provisioning is finished to get maximum performance of your vagrant machine

### Regular usage:

* Stop machine: `vagrant suspend` or `vagrant halt` (the later one is the complete shut down)
* Start machine: `vagrant up`
* Reload machine: `vagrant reload`
* Re-provision machine: `vagrant provision` (if any ansible provisioning configurations were changed or updated)

#### Test virtual hosts:

* [http://[www].phanbox.local/](http://phanbox.local/) - PHP application home page (index.php). It also contains healthcheck logic to verify that PHP app is successfully connected to MySQL, MongoDB and Redis.
* [http://phanbox.local/phpinfo.php](http://phanbox.local/phpinfo.php) - PHP info page
* [http://phanbox.local/index.html](http://phanbox.local/index.html) - Static HTML page served by NGINX
* [http://phanbox.local:3000](http://phanbox.local:3000) - Node.js application home page. It also contains healthcheck logic to verify that Node.js app is successfully connected to MySQL, MongoDB and Redis.

### What does the box consist of?

The box is provisioned using [Ansible](https://www.ansible.com/) tool.
The local host directory `./machine` is mounted to `/vagrant` directory inside vagrant machine
The ansible playbook, roles, tasks and other resources are residing in `machine/ansible` directory, while the application specific code - inside `machine/application`.
The provisioned vagrant machine has following items:

* Ubuntu Xenial64 (16.04 LTS)
* PHP application
    - PHP-FPM 7.1
    - Nginx
    - xDebug
    - Composer
    - Application root: `machine/application/app-php`
    - Document root: `machine/application/app-php/public`
    - Environment (APP_ENV): 'development'
* Node.js application
    - Node.js 8.x
    - Application root: `machine/application/app-node`
    - The application is run using `npm start` command
    - Port: 3000
    - Environment (NODE_ENV): 'development'
    - Daemonized with Systemd service i.e. when you are inside vagrant machine you may start/stop/restart it with `sudo service app-node start/stop/restart` command
* MySQL Percona 5.7
* MongoDB 3.4
* Redis 3.x
* [NFS + Cachefilesd](http://chase-seibert.github.io/blog/2014/03/09/vagrant-cachefilesd.html) - for Linux and Mac OS X NFS folder synchronization is enabled

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
- `sudo service app-node stop` - will stop the node.js app (for example, you want to run it manually instead)
- `sudo service app-node start` - will start the sevice again
- service logs may be found at `/var/log/app-node.log`

If you want to customize it then you may take a look at **app_node** section to modify application root, port, systemd service name, environment.
It is pretty basic application and you may want to add provisioning logic to it. It is failrly easy to do if you have a little knowledge of Ansible.
All you need is to go to the `machine/ansible/roles/app-node` and add there whatever tasks and logic you need.

#### MySQL

If you do not need MySQL for your application:

- Go to `machine/ansible/playbook.yml` and delete **mysql** role from the list
- Go to `machine/ansible/vars/globals.yml` and delete **mysql** section

The default parameters for mysql server:

- User: **app**
- Password: **app**
- Database: **app**
- ROOT PASSWORD: **password**
- Database dump file (will be imported only once during the first provisioning): `machine/dump/mysql.sql`

If you want to customize these parameters see `machine/ansible/vars/globals.yml` **mysql** section

#### MongoDB

If you do not need MongoDB for your application:

- Go to `machine/ansible/playbook.yml` and delete **mongodb** role from the list
- Go to `machine/ansible/vars/globals.yml` and delete **mongodb** section

The default parameters for MongoDB server:

- User: **app**
- Password: **app**
- Database: **app**
- ROOT PASSWORD: **password**
- Database dump directory (will be imported only once during the first provisioning): `machine/dump/mongodb` -
  this directory should contain 1 file per MongoDB collection where the file name is a collection name (with omitted .json extension)
- If your MongoDB dump was exported without [--jsonArray flag](https://docs.mongodb.com/manual/reference/program/mongoexport/#cmdoption-jsonarray) then you should set `dump_array_mode: true` in `machine/ansible/vars/globals.yml` file.

If you want to customize these parameters see `machine/ansible/vars/globals.yml` **mysql** section
