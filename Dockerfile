FROM registry.fpi-inc.site/library/node-dind:16.14.0-alpine as BUILD
#FROM docker-lh.fpi-inc.site/fpi/node:9.11.2-local AS BUILD
LABEL maintainer="周春松<chunsong_zhou@fpi-inc.com>"
WORKDIR /build/
COPY . /build/

#RUN yarn config set registry https://nexus-local.fpi-inc.site/repository/npm-group/ && \
RUN yarn config set registry https://registry.npmmirror.com && \
    yarn config set ignore-engines true && \
    yarn cache clean && \
    yarn && \
    yarn run build && \
    mv /build/version /build/dist/version


FROM registry.fpi-inc.site/library/nginx:1.15.0
COPY --from=BUILD /build/dist /home/fe/PROJECT_NAME