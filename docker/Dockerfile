FROM abernix/meteord:node-12-base
MAINTAINER kallo.bernat@gmail.com
RUN echo 'deb http://deb.debian.org/debian stretch-backports main' >> /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y openjdk-11-jdk-headless && \
    apt-get clean
RUN curl http://131.123.42.38/lmcrs/v1.0.0/srcml_1.0.0-1_ubuntu18.04.deb -o srcml.deb && \
    apt-get update && \
    apt-get install -y libstdc++6 libarchive13 libxml2 libcurl4 libstdc++6=7 && \
    dpkg -i srcml.deb && \
    rm srcml.deb && \
    apt-get clean

#COPY org.eclipse.jdt.ls /opt/org.eclipse.jdt.ls