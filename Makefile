install:
	rsync -av --exclude ".git" --exclude ".DS_Store" --exclude "old" FTHA  10.0.0.40://home/mschnitt/WWW/
	rsync -av --exclude ".git" --exclude ".DS_Store" --exclude "old" FTHA  ra364u2qj4xg@forttejonca.org:/TEST
