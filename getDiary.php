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

$sql = "SELECT year, diary_content FROM diary WHERE month='".$_GET['month']."' and date='".$_GET['date']."' ORDER BY year";

$result = mysqli_query($conn, $sql);
$rows = array();

if (mysqli_num_rows($result) > 0) {
    // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
       // echo "year: " . $row["year"]. "<br>";
       $rows[] = $row;
    }
    echo json_encode($rows);
} else {
    echo json_encode(["0 results"]);
}

mysqli_close($conn);
?>