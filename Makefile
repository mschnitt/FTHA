install: clean dev prod
prod:
	rsync -av --exclude ".git" --exclude ".DS_Store"  --exclude "old" public_html/ ra364u2qj4xg@p3plzcpnl503700.prod.phx3.secureserver.net:/home/ra364u2qj4xg/public_html

dev:
	rsync -av --exclude ".git" --exclude ".DS_Store" --exclude "old" public_html/  10.0.0.40://home/mschnitt/WWW/FTHA

clean:
	find . -name "*DS_Store" -exec rm {} \;
	find . -name "*.swp" -exec rm {} \;
	find . -name "._*" -exec rm {} \;

# The version of SSH on the Mac is newer than the web server. 
# The web server uses older, less secure SSH keys
#To test :  ssh -oHostKeyAlgorithms=+ssh-dss ra364u2qj4xg@forttejonca.org
#This is fixed in ~/.ssh/ssh_config
#Host p3plcpnl0804 p3plcpnl0804.prod.phx3.secureserver.net
#    HostName p3plcpnl0804.prod.phx3.secureserver.net
#    HostKeyAlgorithms ssh-dss
#    IdentityFile ~/.ssh/cpanel_rsa  
#    User  ra364u2qj4xg
#
#Also can try PubkeyAcceptedKeyTypes=+ssh-dss in the rsync