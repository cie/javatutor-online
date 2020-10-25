FROM abernix/meteord:node-12-base
MAINTAINER kallo.bernat@gmail.com
RUN echo 'deb http://deb.debian.org/debian stretch-backports main' >> /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y openjdk-11-jdk-headless && \
    apt-get clean
#COPY org.eclipse.jdt.ls /opt/org.eclipse.jdt.ls