pragma solidity ^0.4.17;

contract Inbox {
    //public variables becomes methods (we can call message() method to get message)
    string public message;

    function Inbox(string initialMessage) public {
        message = initialMessage;
    }

    function setMessage(string newMessage) public {
        message = newMessage;
    }
}