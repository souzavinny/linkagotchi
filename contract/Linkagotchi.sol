// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

contract Linkagotchi is ERC721, VRFConsumerBaseV2Plus {

    enum Stage { Blob, Child, Teen, Adult, Old }
    enum Race { None, Bird, Dog, Cat, Eagle, Wolf, Tiger }

    struct Blockagotchi {
        uint256 id;
        string name;
        uint256 birthTime;
        uint256 age;
        uint256 happiness;
        uint256 health;
        uint256 experience;
        Stage stage;
        Race race;
        bool isShiny;
        bool isActive;
        string generation;
    }

    uint256 public availableEggs = 100;
    uint256 public nextBlockagotchiId = 1;

    uint256 public s_subscriptionId;
    address public vrfCoordinator = 0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B;
    bytes32 public s_keyHash =
        0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae;

    uint32 public callbackGasLimit = 300000;
    uint16 public requestConfirmations = 3;
    uint32 public numWords = 1;

    mapping(uint256 => address) private s_rollers;
    mapping(address => uint256) private s_results;
    mapping(uint256 => string) private s_names;

    mapping(uint256 => Blockagotchi) public blockagotchis;
    mapping(address => uint256) public activeBlockagotchi;
    mapping(uint256 => mapping(string => uint256)) public actionsCount;


    uint256[] public leaderboard;

    event BlockagotchiCreated(uint256 indexed requestId, string name);
    event BlockagotchiHatched(uint256 indexed blockagotchiId, bool isShiny);
    event RandomNumberGenerated(uint256 indexed requestId, uint256 indexed randomNumber);
    event ActiveBlockagotchiSet(uint256 indexed blockagotchiId);
    event BlockagotchiEvolved(uint256 indexed blockagotchiId, Stage newStage);
    event ActionPerformed(uint256 indexed blockagotchiId, string actionType, uint256 newHappiness, uint256 newHealth);

    constructor(uint256 subscriptionId) 
    ERC721("LBlockagotchi", "LBLKGTCHI")
    VRFConsumerBaseV2Plus(vrfCoordinator) 
{
    s_subscriptionId = subscriptionId;
}
function createBlockagotchi(address user, string memory blockagotchiName) external returns (uint256 requestId) {
    require(s_results[user] == 0, "Already created");
    require(availableEggs > 0, "No more eggs available");

    availableEggs = availableEggs - 1;

    requestId = s_vrfCoordinator.requestRandomWords(
        VRFV2PlusClient.RandomWordsRequest({
            keyHash: s_keyHash,
            subId: s_subscriptionId,
            requestConfirmations: requestConfirmations,
            callbackGasLimit: callbackGasLimit,
            numWords: numWords,
            extraArgs: VRFV2PlusClient._argsToBytes(
                VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
            )
        })
    );

    s_rollers[requestId] = user;
    s_results[user] = requestId;
    s_names[requestId] = blockagotchiName; 
    emit BlockagotchiCreated(requestId, blockagotchiName);
}

function fulfillRandomWords(uint256 requestId, uint256[] calldata randomWords) internal override {
    uint256 randomNumber = (randomWords[0] % 8192) + 1;
    address user = s_rollers[requestId];
    s_results[user] = randomNumber;

    _createBlockagotchi(user, requestId, randomNumber);
}

function _createBlockagotchi(address user, uint256 requestId, uint256 randomNumber) internal {
    bool isShiny = (randomNumber == 1);
    uint256 blockagotchiId = nextBlockagotchiId;
    nextBlockagotchiId++;

    Blockagotchi storage blockagotchi = blockagotchis[blockagotchiId];
    blockagotchi.id = blockagotchiId;
    blockagotchi.name = s_names[requestId];
    blockagotchi.birthTime = block.timestamp;
    blockagotchi.health = 100;
    blockagotchi.isShiny = isShiny;
    blockagotchi.stage = Stage.Blob;
    blockagotchi.race = Race.None;
    blockagotchi.generation = (blockagotchiId < 100) ? "Origin" : "Regular";

    _safeMint(user, blockagotchiId);
    emit BlockagotchiHatched(blockagotchiId, isShiny);

    if (activeBlockagotchi[user] == 0) {
        blockagotchi.isActive = true;
        activeBlockagotchi[user] = blockagotchiId;
        emit ActiveBlockagotchiSet(blockagotchiId);
    }
}

function setActiveBlockagotchi(uint256 blockagotchiId) external {
    require(ownerOf(blockagotchiId) == msg.sender, "Not the owner");
    require(blockagotchis[blockagotchiId].isActive == false, "Already active");

    if (activeBlockagotchi[msg.sender] != 0) {
        blockagotchis[activeBlockagotchi[msg.sender]].isActive = false;
    }

    activeBlockagotchi[msg.sender] = blockagotchiId;
    blockagotchis[blockagotchiId].isActive = true;
    emit ActiveBlockagotchiSet(blockagotchiId);
}

function addEggs(uint256 amount) external onlyOwner {
    availableEggs = availableEggs + amount; 
}
function performAction(uint256 blockagotchiId, string memory actionType) external {
    require(ownerOf(blockagotchiId) == msg.sender, "Not the owner");

    Blockagotchi storage blockagotchi = blockagotchis[blockagotchiId];

    require(blockagotchi.stage != Stage.Old, "Cannot perform actions in Old stage");

    if (compareStrings(actionType, "fly") || compareStrings(actionType, "climb") || compareStrings(actionType, "run")) {
        increaseExperience(blockagotchiId);
        increaseHappiness(blockagotchiId, 5);
        increaseHealth(blockagotchiId, 2);
    } else if (compareStrings(actionType, "feed")) {
        increaseHealth(blockagotchiId, 10);
    } else if (compareStrings(actionType, "bathe")) {
        increaseHealth(blockagotchiId, 5);
        increaseHappiness(blockagotchiId, 3);
    }

    actionsCount[blockagotchiId][actionType]++;

    updateStage(blockagotchiId);
    updateRanking(blockagotchiId);

    emit ActionPerformed(blockagotchiId, actionType, blockagotchi.happiness, blockagotchi.health);
}

function increaseExperience(uint256 blockagotchiId) internal {
    Blockagotchi storage blockagotchi = blockagotchis[blockagotchiId];
    blockagotchi.experience += 1;
}

function increaseHappiness(uint256 blockagotchiId, uint256 amount) internal {
    Blockagotchi storage blockagotchi = blockagotchis[blockagotchiId];
    blockagotchi.happiness += amount;
}

function increaseHealth(uint256 blockagotchiId, uint256 amount) internal {
    Blockagotchi storage blockagotchi = blockagotchis[blockagotchiId];
    blockagotchi.health += amount;
}

function updateStage(uint256 blockagotchiId) internal {
    Blockagotchi storage blockagotchi = blockagotchis[blockagotchiId];

    if (blockagotchi.stage == Stage.Blob && blockagotchi.experience >= 5) {
        blockagotchi.stage = Stage.Child;
        blockagotchi.race = determineRace(blockagotchiId);
        emit BlockagotchiEvolved(blockagotchiId, Stage.Child);
    } else if (blockagotchi.stage == Stage.Child && blockagotchi.experience >= 10) {
        blockagotchi.stage = Stage.Teen;
        emit BlockagotchiEvolved(blockagotchiId, Stage.Teen);
    } else if (blockagotchi.stage == Stage.Teen && blockagotchi.experience >= 25) {
        blockagotchi.stage = Stage.Adult;
        blockagotchi.race = evolveRace(blockagotchi.race);
        emit BlockagotchiEvolved(blockagotchiId, Stage.Adult);
    } else if (blockagotchi.stage == Stage.Adult && blockagotchi.experience >= 100) {
        blockagotchi.stage = Stage.Old;
        emit BlockagotchiEvolved(blockagotchiId, Stage.Old);
    }
}

function determineRace(uint256 blockagotchiId) internal view returns (Race) {
    uint256 birdActions = actionsCount[blockagotchiId]["fly"];
    uint256 dogActions = actionsCount[blockagotchiId]["run"];
    uint256 catActions = actionsCount[blockagotchiId]["climb"];

    if (birdActions > dogActions && birdActions > catActions) {
        return Race.Bird;
    } else if (dogActions > birdActions && dogActions > catActions) {
        return Race.Dog;
    } else {
        return Race.Cat;
    }
}

function evolveRace(Race race) internal pure returns (Race) {
    if (race == Race.Bird) {
        return Race.Eagle;
    } else if (race == Race.Dog) {
        return Race.Wolf;
    } else if (race == Race.Cat) {
        return Race.Tiger;
    } else {
        return Race.None;
    }
}

function updateRanking(uint256 blockagotchiId) internal {
    // Remove o Blockagotchi da leaderboard se ele já estiver nela
    removeFromLeaderboard(blockagotchiId);

    // Recalcula o score
    uint256 score = calculateScore(blockagotchiId);

    // Adiciona o Blockagotchi de volta à leaderboard na posição correta
    bool added = false;
    for (uint256 i = 0; i < leaderboard.length; i++) {
        if (score > calculateScore(leaderboard[i])) {
            leaderboard.push(leaderboard[leaderboard.length - 1]);
            for (uint256 j = leaderboard.length - 2; j > i; j--) {
                leaderboard[j + 1] = leaderboard[j];
            }
            leaderboard[i] = blockagotchiId;
            added = true;
            break;
        }
    }

    // Se o Blockagotchi tiver a menor pontuação, ele vai para o final
    if (!added) {
        leaderboard.push(blockagotchiId);
    }
}

function removeFromLeaderboard(uint256 blockagotchiId) internal {
    for (uint256 i = 0; i < leaderboard.length; i++) {
        if (leaderboard[i] == blockagotchiId) {
            for (uint256 j = i; j < leaderboard.length - 1; j++) {
                leaderboard[j] = leaderboard[j + 1];
            }
            leaderboard.pop();
            break;
        }
    }
}

function calculateScore(uint256 blockagotchiId) internal view returns (uint256) {
    Blockagotchi memory blockagotchi = blockagotchis[blockagotchiId];
    uint256 ageInDays = (block.timestamp - blockagotchi.birthTime) / 1 days;
    return blockagotchi.experience + blockagotchi.happiness + ageInDays;
}

function getLeaderboard() external view returns (uint256[] memory) {
    return leaderboard;
}

function getBlockagotchiRank(uint256 blockagotchiId) external view returns (uint256) {
    for (uint256 i = 0; i < leaderboard.length; i++) {
        if (leaderboard[i] == blockagotchiId) {
            return i + 1; 
        }
    }
    return 0; 
}

function compareStrings(string memory a, string memory b) internal pure returns (bool) {
    return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
}

}
