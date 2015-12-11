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

$sql = "DELETE FROM diary WHERE year='".$_POST['year']."' AND month='".$_POST['month']."' AND date='".$_POST['date']."'";

if (mysqli_query($conn, $sql)) {
    echo json_encode(["Record deleted successfully"]);
} else {
    echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}

mysqli_close($conn);
?>