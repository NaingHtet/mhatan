#!/bin/sh

ssh -f -N -L 5433:tomcat.cs.lafayette.edu:5432 escalonn@tomcat.cs.lafayette.edu
