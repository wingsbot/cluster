#!/bin/sh

rm -rf generated
mkdir generated

protoc \
  --plugin=./node_modules/.bin/protoc-gen-ts_proto \
  --ts_proto_opt=esModuleInterop=true,outputServices=grpc-js \
  --ts_proto_out=generated \
  -I=./protos protos/*.proto