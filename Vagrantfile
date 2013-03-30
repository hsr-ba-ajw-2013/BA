#
# # Vagrant Box "Bachelorarbeit"
# ## Operating System
# * Debian 6.0 Squeeze, 64-bit
#
# ## Available Software
# * node 0.8.22 (0.10.0 prepared via nvm)
# * PostgreSQL 9.1
# * Ruby 2.0.0 (via rvm)
# * Sun Java 6
# * ZSH (with oh-my-zsh)
#
# ## Default Port Forwardings
# Following ports on your local machine will be forwarded to this applications inside the vagrant box:
# * 2222 -> 22 (SSH)
# * 9000 -> 80 (HTTP)
# * 9001 -> 3000 (node.js Express.js instance, the actual Roomies application)
# * 9002 -> 5432 (PostgreSQL)
#
# Modify your Vagrantfile if you need any specific port forwardings.
#
# ## Additional Notes
# ### PostgreSQL
# * The system user `postgres` uses `postgres` as password
# * The default database user `postgres` has no password yet
# * The database server is accessible from any remote host via IPv4. Consider changing this via `/etc/postgresql/9.1/main/pg_hba.conf`
# * When in the vagrant box' shell, use `psql -h localhost -U postgres` to connect with the default database user
# * When outside (i.e. using PGAdmin), connect to the mapped port 9002 using the `postgres` default database user
#
# ### ZSH
# ZSH is the default login shell for the vagrant user
#
# ### Symlinks
# This box enables symlinks inside shared folders by default. Thanks http://blog.liip.ch/archive/2012/07/25/vagrant-and-node-js-quick-tip.html.
#
Vagrant::Config.run do |config|
  config.vm.box = "ba-box"
  config.vm.box_url = "https://dl.dropbox.com/u/694056/ba.box"
end
