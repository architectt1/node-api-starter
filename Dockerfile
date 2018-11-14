FROM topcoder/topcoder-tco2018-base

# add dependencies before the code so it they can be cached
ADD package.json .
ADD package-lock.json .
RUN npm i

# add everything else after installing dependencies so code changes don't make dependencies be downloaded again
ADD . .

CMD ["npm", "start"]
