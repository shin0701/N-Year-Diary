<?php
$servername = "localhost";
$username = "root";
$password = "*****";
$dbname = "diary";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);
// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$diary = str_replace("'", "\'", $_POST['diary_content']);

if($_POST['type']=="I"){
    $sql = "INSERT INTO diary (year, month, date, diary_content) VALUES ('".$_POST['year']."', '".$_POST['month']."', '".$_POST['date']."', '".$diary."')";
}
else{
    //$sql = "UPDATE diary SET year='".$_GET['year'].", month='".$_GET['month']."', date='".$_GET['date']."', diary_content='".$_GET['diary_content']."'
    $sql = "UPDATE diary SET diary_content='".$diary."' WHERE year='".$_POST['year']."' AND month='".$_POST['month']."' AND date='".$_POST['date']."'";
}

if (mysqli_query($conn, $sql)) {
    if($_POST['type']=="I"){
        echo json_encode(["New record created successfully"]);
    }
    else{
        echo json_encode(["Record updated successfully"]);
    }
} else {
    echo "Error: " . $sql . "\n\n" . mysqli_error($conn);
}

mysqli_close($conn);
?>