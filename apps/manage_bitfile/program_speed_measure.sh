#!/bin/bash
source /home/viettien/NetFPGA10/bashrc_addon_NetFPGA_10G 
sh /home/viettien/NetFPGA10/tools/scripts/impact_run.sh /home/viettien/NetFPGA10/bitfiles/Speed_measure_none7820.bit
ifconfig nf0 up
ifconfig nf1 up
ifconfig nf2 up
ifconfig nf3 up
