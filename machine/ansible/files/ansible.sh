#!/usr/bin/env bash

INSTALLED=$(dpkg -l | grep ansible)

if [ "$INSTALLED" != "" ]; then
    echo "Package ansible has been already installed"
else
    echo "Installing ansible package...."
    # Update Repositories
    sudo apt-get update

    # Add Ansible Repository & Install Ansible
    sudo apt-get install -y software-properties-common
    sudo add-apt-repository -y ppa:ansible/ansible
    sudo apt-get update
    sudo apt-get install -y ansible

    # Setup Ansible for Local Use and Run
    cp /vagrant/ansible/inventory/hosts /etc/ansible/hosts -f
    cp /vagrant/ansible/inventory/ansible.cfg /etc/ansible/ansible.cfg -f
    chmod 666 /etc/ansible/hosts
    chmod 666 /etc/ansible/ansible.cfg
    cat /vagrant/ansible/files/authorized_keys >> /home/vagrant/.ssh/authorized_keys
fi

sudo ansible-playbook /vagrant/ansible/playbook.yml --connection="local"
