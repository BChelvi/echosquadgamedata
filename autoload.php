<?php
spl_autoload_register(
function ($classename)
{
    
    include  "./class/".strtolower($classename).".class.php" ;
}

);