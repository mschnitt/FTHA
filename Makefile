install:
	rsync -av --exclude ".git" --exclude ".DS_Store" --exclude "old" public_html/ ra364u2qj4xg@p3plcpnl0804.prod.phx3.secureserver.net:/home/ra364u2qj4xg/public_html
	rsync -av --exclude ".git" --exclude ".DS_Store" --exclude "old" public_html/  10.0.0.40://home/mschnitt/WWW/FTHA
