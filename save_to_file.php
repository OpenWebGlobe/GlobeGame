<?php
header("Content-Disposition: attachment; filename=challenge.json");
header("Content-Type: text/force-download");
header("Content-Length: " . strlen($_GET['content']));
header("Connection: close");
echo $_GET['content'];
exit();
?>