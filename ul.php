<?php
$img = imagecreatefromjpeg($_POST['data']);

if(!$img || strlen($_POST['data']) > 105000)
{
   die("error_img_or_size");
}
$filename = "ul/".uniqid("gg").".jpg";
imagejpeg($img,$filename );
echo $filename;
?>