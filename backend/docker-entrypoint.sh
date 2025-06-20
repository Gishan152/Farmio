#!/bin/sh
./mvnw spring-boot:run &
while sleep 1; do
  find src -name '*.java' | xargs sha1sum > sum.txt
  if ! cmp -s sum.txt prev.txt; then
    mvn compile
    mv sum.txt prev.txt
  fi
done
