require 'yaml'
VAGRANTFILE_API_VERSION = "2"

# If you want to use 'nfs' synchronization on Linux systems
# Ubuntu: apt-get -y install nfs-kernel-server nfs-common
# CentOS: yum -y install nfs-utils nfs-utils-lib
# Mac OS X: it should be already pre-installed

# The host name (you should also change it in the ansible/vars/globals.yml)
HOSTNAME = 'phanbox.local'
ALIASES = %w(www.phanbox.local api.phanbox.local)

# Allocate hardware resources for the virtual machine
CPU = 4
RAM = 4096

# I don't think you want to change it...
# In case you do change it you also need change it in "machine/ansible/inventory"
IP_ADDRESS = '10.10.10.10'

# Check to determine whether we're on a windows or linux/os-x host,
# later on we use this to launch ansible in the supported way
# source: https://stackoverflow.com/questions/2108727/which-in-ruby-checking-if-program-exists-in-path-from-ruby
def which(cmd)
  exts = ENV['PATHEXT'] ? ENV['PATHEXT'].split(';') : ['']

  ENV['PATH'].split(File::PATH_SEPARATOR).each do |path|
    exts.each { |ext|
      exe = File.join(path, "#{cmd}#{ext}")
      return exe if File.executable? exe
    }
  end

  return nil
end

Vagrant.require_version '>= 1.8.5'
Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  # We cannot use can canonical ubuntu/xenial64 as it doesn't provided vagrant user
  # despite to vagrant convention that the default user is named always "vagrant"
  # https://bugs.launchpad.net/cloud-images/+bug/1569237
  config.vm.box = 'bento/ubuntu-16.04'
  config.vm.hostname = HOSTNAME
  config.vm.network :private_network, :ip => IP_ADDRESS

  #config.ssh.insert_key = false
  config.ssh.forward_agent = true

  # Prevent TTY Errors (copied from laravel/homestead: "homestead.rb" file)... By default this is "bash -l".
  config.ssh.shell = "bash -c 'BASH_ENV=/etc/profile exec bash'"

  # Setup directories synchronization mode
  if Vagrant::Util::Platform.windows?
    sync_options = {
      :mount_options => ["dmode=775", "fmode=775"],
      :owner => 'vagrant',
      :group => 'vagrant'
    }
  else
    sync_options = {
      :nfs => { :mount_options => ["dmode=775", "fmode=775", "actimeo=1", "lookupcache=non", "rw", "vers=3", "tcp", "fsc"] }
    }
  end

  config.vm.synced_folder "./machine", "/vagrant", sync_options

  # Configure VirtualBox provider
  config.vm.provider :virtualbox do |vb|
    vb.name = HOSTNAME

    vb.customize ["modifyvm", :id, "--cpus", CPU]
    vb.customize ["modifyvm", :id, "--memory", RAM]
    vb.customize ["modifyvm", :id, "--ioapic", "on"]
    vb.customize ["modifyvm", :id, "--cableconnected1", "on"]
    vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    vb.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
    vb.customize ["modifyvm", :id, "--nictype1", "virtio"]
    vb.customize ["modifyvm", :id, "--nictype2", "virtio"]
    vb.customize ["guestproperty", "set", :id, "/VirtualBox/GuestAdd/VBoxService/--timesync-set-threshold", 10000]
    vb.customize ["guestproperty", "set", :id, "/VirtualBox/GuestAdd/VBoxService/--timesync-interval", 5000]
  end

  # Update "host" file for host/guest machines
  if Vagrant.has_plugin? 'vagrant-hostmanager'
    config.hostmanager.enabled = true
    config.hostmanager.manage_host = true
    config.hostmanager.manage_guest = true
    config.hostmanager.ignore_private_ip = false
    config.hostmanager.include_offline = true

    if ALIASES.any?
      config.hostmanager.aliases = ALIASES
    end
  end

  # Run Host Manager provision
  config.vm.provision :hostmanager

  # If ansible is in your path it will provision from your HOST machine
  # If ansible is not found in the path it will be instaled in the VM and provisioned from there
  if which('ansible-playbook')
    config.vm.provision "ansible" do |ansible|
      ansible.playbook = "machine/ansible/playbook.yml"
      ansible.inventory_path = "machine/ansible/inventory/hosts"
      ansible.limit = 'all'
    end
  else
    config.vm.provision :shell, path: "machine/ansible/files/ansible.sh"
  end

  ansible_vars_path = "#{File.dirname(__FILE__)}/machine/ansible/vars/globals.yml"
  ansible_vars = YAML.load_file(ansible_vars_path)

  if ansible_vars.has_key?('app_node') and ansible_vars['app_node'].has_key?('service_name')
    # Automatically start node.js application when vagrant launched
    app_node_service = ansible_vars['app_node']['service_name']
    config.vm.provision "shell", run: "always", inline: "systemctl restart #{app_node_service}"
  end
end
