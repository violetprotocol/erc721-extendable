# ERC721 Token Extendable<>Extensions

ERC721 token standard implementation conversion to be usable by Extendable<>Extension architecture.

Re-use and replace specific components of your ERC721 token contract using extensions. You can easily upgrade and replace specific components and functions, like minting and burning without having to replace the entire contract. Common hooks like `_beforeTokenTransfer` can also be upgraded where other functions make call outs to it during its lifecycle.

## Usage

```bash
npm install @violetprotocol/extendable-erc721
```

```bash
yarn add @violetprotocol/extendable-erc721
```

```solidity
import "@violetprotocol/extendable-erc721/base/ERC721.sol"
import "@violetprotocol/extendable-erc721/metadata/ERC721Metadata.sol"
import "@violetprotocol/extendable-erc721/enumerable/ERC721Enumerable.sol"
import "@violetprotocol/extendable-erc721/ERC721MetadataEnumerable.sol"

contract Token is ERC721 {}
contract MetadataToken is ERC721Metadata {}
contract EnumerableToken is ERC721Enumerable {}
contract MetadataEnumerableToken is ERC721MetadataEnumerable {}
```

## Architecture

There are four top-level Extendable token contracts:

* ERC721
* ERC721Metadata
* ERC721Enumerable
* ERC721MetadataEnumerable

Note that all token contracts leave the implementation of `mint` and `burn` functions to the developer and in this case, they can be added after deployment as separate extensions to extend your token contract with. The `Metadata` token contracts do have a `burn` function implementation already that removes metadata upon token burn, but can be inherited and developed upon further prior to extending.

#### ERC721

This contains the base functionality for the ERC721 contract.

#### ERC721Metadata

This contains the extension functionality for ERC721 tokens to manage tokenURIs for tokens and to be able to get the token collection name and symbol.

#### ERC721Enumerable

This contains the extension functionality for ERC721 tokens to be enumerable. This helps track the number of tokens issued, total supply, and the number of tokens owned by an address.

#### ERC721MetadataEnumerable

This contains a combination of the `Metadata` and `Enumerable` functionality.


### Extensions

#### ERC721

`ApproveLogic.sol` - contains all state-mutating functions involving token approvals.

`GetterLogic.sol` - contains all view-functions for reading state from the contract.

`BeforeTransferLogic.sol` - contains the `_beforeTokenTransfer` hook.

`OnReceiveLogic.sol` - contains the logic for checking token receive by contracts.

`TransferLogic.sol` - contains the core transfer logic.

##### Additional

`MintLogic.sol` - contains the core internal mint logic that should be inherited by an external contract
`BasicMintLogic.sol` - contains a basic implementation of mint logic that inherits `MintLogic.sol`

`BurnLogic.sol` - contains the core internal burn logic that should be inherited by an external contract
`BasicBurnLogic.sol` - contains a basic implementation of burn logic that inherits `BurnLogic.sol`

#### ERC721Metadata

`MetadataGetterLogic` - contains all metadata-related view-functions for reading metadata state.
`SetTokenURILogic` - contains the internal `_setTokenURI` function for setting URIs to tokens.
`MetadataBurnLogic` - contains a metadata-specific implementation of burn logic.

#### ERC721Enumerable

`EnumerableGetterLogic` - contains all enumerable-related view-functions for reading enumerable token state.
`EnumerableBeforeTransferLogic` - contains an inherited implementation of the `_beforeTokenTransfer` hook for enumerable tokens.

### Storage

#### ERC721Storage

Records the main ownership state for the ERC721 token:

```solidity
struct ERC721State {
    // Token name
    string _name;

    // Token symbol
    string _symbol;

    // Mapping from token ID to owner address
    mapping(uint256 => address) _owners;

    // Mapping owner address to token count
    mapping(address => uint256) _balances;

    // Mapping from token ID to approved address
    mapping(uint256 => address) _tokenApprovals;

    // Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) _operatorApprovals;
}
```

#### ERC721TokenURIStorage

Records the additional token URI information for the ERC721 token:

```solidity
struct TokenURIState {
    // Mapping from token ID to token uri
    mapping(uint256 => string) _tokenURIs;
}
```

#### ERC721EnumerableStorage

Records the enumeration state for the ERC721 token:

```solidity
struct ERC721EnumerableState {
    // Mapping from owner to list of owned token IDs
    mapping(address => mapping(uint256 => uint256)) _ownedTokens;

    // Mapping from token ID to index of the owner tokens list
    mapping(uint256 => uint256) _ownedTokensIndex;

    // Array with all token ids, used for enumeration
    uint256[] _allTokens;

    // Mapping from token id to position in the allTokens array
    mapping(uint256 => uint256) _allTokensIndex;
}
```

## Requirements

`nodejs >=12.0`

## Build

`npm install` to install all dependencies.

`npx hardhat compile` to build all contract artifacts.

## Test

`npx hardhat test` to run tests.
