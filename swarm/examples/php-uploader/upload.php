<?php

include_once 'SwarmUploader.php';
$uploader = new SwarmUploader();

echo $uploader->uploadDirectory('Z:\Ethereum\git-experiments\go-ethereum\swarm\examples\filemanager');
