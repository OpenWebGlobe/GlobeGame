<?php
error_reporting(E_ERROR | E_WARNING | E_PARSE);
$dict36 = array(
   0=> "C",
   1=> "Q",
   2=> "A",
   3=> "Y",
   4=> "2",
   5=> "W",
   6=> "S",
   7=> "#",
   8=> "3",
   9=> "E",
   10=> "D",
   11=> "X",
   12=> "V",
   13=> "F",
   14=> "R",
   15=> "4",
   16=> "5",
   17=> "T",
   18=> "G",
   19=> "B",
   20=> "N",
   21=> "H",
   22=> "Z",
   23=> "6",
   24=> "7",
   25=> "U",
   26=> "J",
   27=> "M",
   28=> "K",
   29=> "I",
   30=> "8",
   31=> "9",
   32=> "@",
   33=> "L",
   34=> "P",
   35=> "1"
);
$praefix = "gg_";
$count = MysqlExec("SELECT * FROM `".$praefix."highscore`");
echo Hash36(mysql_num_rows($count)+1,$dict36);
function Hash36($x,$dict)
{
   $output = "";
   function base36($r,$o,$dict){
      $h = floor($r / 36);
      $i = $r % 36;
      if($h >= 1)
      {
         return base36($h,$dict[$i].$o, $dict);
      }
      else
      {
         $ret = $dict[$r].$o;
         while(strlen($ret) < 4)
         {
            $ret = "C".$ret;
         }
         return $ret;
      }
   }
   $val = "";
   return base36($x,$val,$dict);
}


function MysqlExec($statement)
{
   include("config.php");
   $praefix = "gg_";
   //DBConnect
   $dblink = mysql_connect($gHOST, $gUSER, $gPASS) or die(": " . mysql_error());
   mysql_select_db($gDB,$dblink);
   return mysql_query($statement,$dblink);
}





?>