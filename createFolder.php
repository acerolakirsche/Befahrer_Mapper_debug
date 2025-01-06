<?php
$ordnerName = 'Leon3';

if (is_dir($ordnerName)) {
    echo "Der Ordner '$ordnerName' existiert bereits.";
} else {
    if (mkdir($ordnerName, 0777)) {
        echo "Der Ordner '$ordnerName' wurde erfolgreich erstellt.";
    } else {
        echo "Fehler: Der Ordner '$ordnerName' konnte nicht erstellt werden.";
    }
}
?>
