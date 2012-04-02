<?php
    header("Content-Type: text/html; charset=windows");
	//error_reporting(E_ERROR | E_WARNING | E_PARSE);
	$dir = "data/challenges/";
    if($_GET['lang'] == "de")
    {
    	$dir = $dir."de/";
    }
    else if($_GET['lang'] == "en")
    {
    	$dir = $dir."en/";
    }
		if ($handle = opendir($dir)) {
			$inc = 0;
			echo "{\n";
    	while (false !== ($file = readdir($handle))) {
        if ($file != "." && $file != "..") {
        	if( substr($file, -4) == "json")
        	{
        		if($inc > 0)
        		{
        			echo ",\n";
        		}
        		echo "\"".$inc."\":";
						$fh = fopen($dir.$file, 'rb');
            $data = fread($fh, filesize($dir.$file));
						fclose($fh);
						echo $data;
						$inc += 1;
          }
        }
    	}
  	}
    closedir($handle);
    echo "\n}";
    
?>