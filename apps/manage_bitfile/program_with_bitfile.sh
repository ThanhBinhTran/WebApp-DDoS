#!/bin/bash
source /home/viettien/NetFPGA10/bashrc_addon_NetFPGA_10G 
sh /home/viettien/NetFPGA10/tools/scripts/impact_run.sh /home/viettien/NetFPGA10/bitfiles/Vu_PCI_core_250MHz_with_virus.bit
ifconfig nf0 up
ifconfig nf1 up
