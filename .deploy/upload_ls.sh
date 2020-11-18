#!/bin/sh

cd $(dirname $0)
rsync -Pav -e "ssh -i $HOME/.ssh/id_rsa_javatutor" ../docker/org.eclipse.jdt.ls root@javatutor.tk:/opt
