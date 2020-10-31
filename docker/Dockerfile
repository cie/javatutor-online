FROM ubuntu:bionic
MAINTAINER kallo.bernat@gmail.com

ENV METEORD_DIR /opt/meteord
COPY scripts $METEORD_DIR

ARG NODE_VERSION
ENV NODE_VERSION ${NODE_VERSION:-12.16.1}
ONBUILD ENV NODE_VERSION ${NODE_VERSION:-12.16.1}

RUN bash $METEORD_DIR/lib/install_base.sh
RUN bash $METEORD_DIR/lib/install_node.sh
RUN bash $METEORD_DIR/lib/install_phantomjs.sh
RUN bash $METEORD_DIR/lib/cleanup.sh

EXPOSE 80
RUN chmod +x $METEORD_DIR/run_app.sh
ENTRYPOINT exec $METEORD_DIR/run_app.sh

# https://github.com/debuerreotype/docker-debian-artifacts/issues/24
RUN mkdir -p /usr/share/man/man1 
RUN apt-get update && \
    apt-get install -y default-jdk-headless
RUN apt-get install -y libarchive13 libxml2
RUN curl http://131.123.42.38/lmcrs/v1.0.0/srcml_1.0.0-1_ubuntu18.04.deb -o srcml.deb && \
    dpkg -i srcml.deb && \
    rm srcml.deb
RUN apt-get clean

#COPY org.eclipse.jdt.ls /opt/org.eclipse.jdt.ls