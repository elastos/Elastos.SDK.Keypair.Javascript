Getting started with the wallet API
########################################

.. toctree::
  :maxdepth: 3

.. constants:

Constants
---------

.. c:macro:: EXTERNAL_CHAIN

  Indicate the external chain.

.. c:macro:: INTERNAL_CHAIN

  Indicate the internal chain.

.. api:

APIs
------

getSinglePublicKey
~~~~~~~~~~~~~~~~~~~

.. code-block:: javascript

    char* getSinglePublicKey(const void* seed, int seedLen)

Get single address wallet public key.

  **Return**
    the public key if succeeded, or nullptr if failed.

    *if you no longer use, call freeBuf to free memory.*

  **Parameter**
    :[in] seed: binary conent of seed.
    :[in] seedLen: the length of seed.


getSinglePrivateKey
~~~~~~~~~~~~~~~~~~~

.. code-block:: javascript

    char* getSinglePrivateKey(const void* seed, int seedLen)

Get single address wallet private key.

  **Return**
    the private key if succeeded, or nullptr if failed.

    *if you no longer use, call freeBuf to free memory.*

  **Parameter**
    :[in] seed: binary conent of seed.
    :[in] seedLen: the length of seed.


getMasterPublicKey
~~~~~~~~~~~~~~~~~~~

.. code-block:: javascript

    MasterPublicKey* getMasterPublicKey(const void* seed, int seedLen, int coinType)

Get master public key for HD wallet.

  **Return**
    the master public key if succeeded, or nullptr if failed.

    *if you no longer use, delete the pointer of MasterPublicKey.*

  **Parameter**
    :[in] seed: binary conent of seed.
    :[in] seedLen: the length of seed.
    :[in] coinType: coin type.


getAddress
~~~~~~~~~~~~~~~~~~~

.. code-block:: javascript

    char* getAddress(const char* publicKey)

Get address from public key.

  **Return**
    the address if succeeded, or nullptr if failed.

    *if you no longer use, call freeBuf to free memory.*

  **Parameter**
    :[in] publicKey: the public key.


generateMnemonic
~~~~~~~~~~~~~~~~~~~

.. code-block:: javascript

    char* generateMnemonic(const char* language, const char* words)

Generate mnemonic.

  **Return**
    the mnemonic if succeeded, or nullptr if failed.

    *if you no longer use, call freeBuf to free memory.*

  **Parameter**
    :[in] language: language, such as english, chinese etc.
    :[in] words: the words, seperated by ' ', if the language is english, words is empty string.


getSeedFromMnemonic
~~~~~~~~~~~~~~~~~~~

.. code-block:: javascript

    int getSeedFromMnemonic(void** seed, const char* mnemonic, const char* language, const char* words, const char* mnemonicPassword)

Get seed from mnemonic.

  **Return**
    the seed buffer length if succeeded, or 0 if failed.

  **Parameter**
    :[out] seed: the seed content, if no longer user, call freeBuf to free memory.
    :[in] mnemonic: mnemonic, seperated by ' '.
    :[in] language: language, such as english, chinese etc.
    :[in] words: the words, seperated by ' ', if the language is english, words is empty string.
    :[in] mnemonicPassword: mnemonic password, empty string or effctive password.


getPublicKeyFromPrivateKey
~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: javascript

    char* getPublicKeyFromPrivateKey(const char* privateKey)

Get public key from private key.

  **Return**
    the public key if succeeded, or nullptr if failed.

    *if you no longer use, call freeBuf to free memory.*

  **Parameter**
    :[in] privateKey: the private key.


