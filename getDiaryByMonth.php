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

$sql = "SELECT date, diary_content FROM diary WHERE year='".$_GET['year']."' and month='".$_GET['month']."' ORDER BY date";

$result = mysqli_query($conn, $sql);
$rows = array();

if (mysqli_num_rows($result) > 0) {
    // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
       // echo "daate: " . $row["date"]. "<br>";
       $rows[] = $row;
    }
    echo json_encode($rows);
} else {
    echo json_encode(["0 results"]);
}

mysqli_close($conn);
?>