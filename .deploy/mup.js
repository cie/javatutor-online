module.exports = {
  servers: {
    one: {
      host: '136.244.103.253',
      username: 'root',
      pem: '~/.ssh/id_rsa_javatutor'
      // or neither for authenticate from ssh-agent
    }
  },

  app: {
    name: 'javatutor',
    path: '../',
    volumes: {
      '/var/run/docker.sock': '/var/run/docker.sock'
    },

    servers: {
      one: {}
    },

    buildOptions: {
      serverOnly: true
    },

    env: {
      ROOT_URL: 'http://136.244.103.253',
      MONGO_URL: 'mongodb://mongodb/meteor',
      MONGO_OPLOG_URL: 'mongodb://mongodb/local'
    },

    docker: {
      // abernix/meteord:node-12-base works with Meteor 1.9 - 1.10
      // If you are using a different version of Meteor,
      // refer to the docs for the correct image to use.
      image: 'abernix/meteord:node-12-base',
      buildInstructions: []
    },
    deployCheckWaitTime: 300,

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },

  mongo: {
    version: '3.4.1',
    servers: {
      one: {}
    }
  }

  // (Optional)
  // Use the proxy to setup ssl or to route requests to the correct
  // app when there are several apps

  // proxy: {
  //   domains: 'mywebsite.com,www.mywebsite.com',

  //   ssl: {
  //     // Enable Let's Encrypt
  //     letsEncryptEmail: 'email@domain.com'
  //   }
  // }
}
