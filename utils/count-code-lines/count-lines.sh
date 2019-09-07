#!/bin/bash

find ../../src -name "*.*" -not -path "*/vendors/*" | xargs cat | grep "[a-Z0-9]" | wc -l