<?php
    header("Content-Type: text/html; charset=windows");
	//error_reporting(E_ERROR | E_WARNING | E_PARSE);
	$dir = "data/base/";
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
						$fh = fopen($dir.$file, 'rb');
            $data = fread($fh, filesize($dir.$file));
						fclose($fh);
                  echo "\"";
						echo substr($file, 0, -5);
                  echo "\" :";
                  echo $data;
						$inc += 1;
          }
        }
    	}
  	}
    closedir($handle);
    echo "\n}";
    
?>