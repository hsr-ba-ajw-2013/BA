#
# # Vagrant Box "Bachelorarbeit"
# ## Available Software:
# * node 0.8.22 (0.10.0 prepared via nvm)
# * PostgreSQL 9.1
# * Ruby 2.0.0 (via rvm)
# * ZSH (with oh-my-zsh)
#
# ## Default Port Forwardings
# Following ports on your local machine will be forwarded to this box' applications:
# * 2222 -> 22 (SSH)
# * 9000 -> 80 (HTTP)
# * 9001 -> 3000 (Express.js Instance; the actual Roomies Application)
# * 9002 -> 5432 (PostgreSQL)
#
# Modify your Vagrantfile if you need any specific port forwardings.
#
# ## Additional Notes
# ### PostgreSQL
# * The default user `postgres` has no password yet
# * The database server is accessible from any remote host via IPv4. Consider changing this via `/etc/postgresql/9.1/main/pg_hba.conf`
#
# ### ZSH
# ZSH is the default login shell for the vagrant user
#
Vagrant::Config.run do |config|
  config.vm.box = "ba-box"
  config.vm.box_url = "https://dl.dropbox.com/u/6981682/ba-box.box"
end
